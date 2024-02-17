import { toKebabCase } from "../utilities";

type Option = {
  key: string;
  name: string;
}

interface SelectProps extends Omit<React.HTMLProps<HTMLSelectElement>, 'onSelect'> {
  options: Option[];
  value: string;
  onSelect: (key: string) => void;
}

function Select({options, value, onSelect, ...restProps}: SelectProps) {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect && onSelect(event.target.value);
  }

  return (
    <>
      {restProps.name && <label htmlFor={toKebabCase(restProps.name)}>{restProps.name}</label>}
      <select value={value} onChange={handleSelect} {...restProps} id={toKebabCase(restProps.name)}>
        <option value="">Select an option</option>
        {options.map(entry => (
          <option key={entry.key} id={entry.key}>{entry.name}</option>
        ))}
      </select>
    </>
  )
}

export default Select
