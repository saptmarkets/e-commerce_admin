import React from "react";
import SwitchToggle from "../form/switch/SwitchToggle";

const BilingualToggle = ({
  label,
  name,
  register,
  defaultValue = true
}) => {
  const [isEnabled, setIsEnabled] = React.useState(defaultValue);

  const handleToggle = (checked) => {
    setIsEnabled(checked);
    // Update the form value
    if (register) {
      register(name).onChange({ target: { name, value: checked } });
    }
  };

  return (
    <div className="mb-6">
      <SwitchToggle
        id={name}
        title={label}
        handleProcess={handleToggle}
        processOption={isEnabled}
      />
    </div>
  );
};

export default BilingualToggle; 