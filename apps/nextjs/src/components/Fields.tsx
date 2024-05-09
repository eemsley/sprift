/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";

const formClasses =
  "block w-full appearance-none rounded-lg border border-gray-200 bg-white py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-gray-900 placeholder:text-gray-400 focus:border-secondary-300 focus:outline-none focus:ring-secondary-300 sm:text-sm";

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-2 block text-sm font-general-sans-medium font-semibold text-gray-900"
    >
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  type = "text",
  className,
  ...props
}: any) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  );
}

export function SelectField({ id, label, className, ...props }) {
  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, "pr-8")} />
    </div>
  );
}
