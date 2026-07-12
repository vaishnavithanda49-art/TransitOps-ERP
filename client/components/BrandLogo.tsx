interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export default function BrandLogo({ className = "", showText = true, textClassName = "" }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <img
        src="/transitops-logo.svg"
        alt="TransitOps logo"
        className="h-8 w-8 flex-shrink-0 rounded-lg object-contain"
      />
      {showText ? (
        <span className={`text-lg font-semibold tracking-tight text-foreground ${textClassName}`.trim()}>
          TransitOps
        </span>
      ) : null}
    </div>
  );
}
