#!/bin/bash

# Configurações
BACKUP_DIR="/backups/supabase"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar diretório de backup se não existir
mkdir -p $BACKUP_DIR

# Backup do banco de dados
echo "Iniciando backup do banco de dados..."
supabase db dump -f "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup dos buckets do Storage
echo "Iniciando backup dos buckets..."
supabase storage download --bucket=campaigns --output-dir="$BACKUP_DIR/storage_backup_$DATE/campaigns"
supabase storage download --bucket=profiles --output-dir="$BACKUP_DIR/storage_backup_$DATE/profiles"

# Compactar backups
echo "Compactando backups..."
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" \
    "$BACKUP_DIR/db_backup_$DATE.sql" \
    "$BACKUP_DIR/storage_backup_$DATE"

# Upload para S3
echo "Enviando backup para S3..."
aws s3 cp "$BACKUP_DIR/backup_$DATE.tar.gz" \
    "s3://$AWS_BUCKET_NAME/backups/supabase/backup_$DATE.tar.gz"

# Limpar arquivos temporários
echo "Limpando arquivos temporários..."
rm "$BACKUP_DIR/db_backup_$DATE.sql"
rm -rf "$BACKUP_DIR/storage_backup_$DATE"

# Remover backups antigos (local)
echo "Removendo backups antigos locais..."
find $BACKUP_DIR -type f -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -exec rm {} \;

# Remover backups antigos (S3)
echo "Removendo backups antigos do S3..."
aws s3 ls "s3://$AWS_BUCKET_NAME/backups/supabase/" | \
    while read -r line; do
        createDate=`echo $line|awk {'print $1" "$2'}`
        createDate=`date -d"$createDate" +%s`
        olderThan=`date -d"-$RETENTION_DAYS days" +%s`
        if [[ $createDate -lt $olderThan ]]
        then
            fileName=`echo $line|awk {'print $4'}`
            if [[ $fileName != "" ]]
            then
                aws s3 rm "s3://$AWS_BUCKET_NAME/backups/supabase/$fileName"
            fi
        fi
    done

echo "Backup concluído com sucesso!"
