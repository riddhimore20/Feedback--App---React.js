import React from 'react';
import PropTypes from 'prop-types';

function Button({
  children,
  version = 'primary',
  size = 'md',
  type = 'button',
  isDisabled = false,
  onClick,
  className = '',
  ariaLabel,
}) {
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`btn btn-${version} btn-${size} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  version: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;
