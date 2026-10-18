import type { ReactNode, MouseEventHandler } from "react";

interface Props {
  children: ReactNode;
  /** With href renders <a>, otherwise <button>. */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  /** Opens in a new tab with rel=noopener. */
  external?: boolean;
  /** Adds the download attribute (value = file name or true). */
  download?: boolean | string;
  className?: string;
  ariaLabel?: string;
  type?: "button" | "submit";
}

export default function Button({
  children, href, onClick, variant = "primary", size = "md", external, download, className = "", ariaLabel, type = "button",
}: Props) {
  const cls = `btn btn-${variant}${size === "sm" ? " btn-sm" : ""} ${className}`.trim();
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement> | undefined}
        aria-label={ariaLabel}
        download={download === true ? "" : download || undefined}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick as MouseEventHandler<HTMLButtonElement> | undefined} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
