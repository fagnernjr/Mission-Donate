interface PageHeaderProps {
  title: string
  description?: string
  backgroundImage?: string
}

export function PageHeader({
  title,
  description,
  backgroundImage,
}: PageHeaderProps) {
  return (
    <div
      className={`relative py-24 ${
        backgroundImage ? 'text-white' : 'bg-muted'
      }`}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}
      <div className="container relative z-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
