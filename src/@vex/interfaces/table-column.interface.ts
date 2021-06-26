export interface TableColumn<T> {
  label: string;
  property: keyof T | string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'object'|'boolean'|'date' |'number';
  visible?: boolean;
  object?: String;
  cssClasses?: string[];
}
