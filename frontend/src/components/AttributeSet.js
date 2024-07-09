// AttributeSet.js
import React, { Component } from 'react';
import { toKebabCase } from '../utilities/toKebabCase';

class AttributeSet extends Component {
  render() {
    const { setName, attributes, selectedAttributes, handleCheckboxChange, testIdPrefix } = this.props;

    return (
      <div className="attribute-set" key={setName} data-testid={`${testIdPrefix}-${toKebabCase(setName)}`}>
        <h3 className="attribute-set-name">{setName}</h3>
        <div className="attributes">
          {attributes.map(attr => {
            const isSelected = selectedAttributes[setName] === attr.id;
            return (
              <div key={attr.id} className="attribute">
                <label
                  className={`inner-attribute ${isSelected ? 'selected' : ''}`}
                  style={setName === 'Color' ? { backgroundColor: attr.value } : {}}
                >
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(setName, attr.id)}
                    checked={isSelected}
                    data-testid={`${testIdPrefix}-${toKebabCase(setName)}-${toKebabCase(attr.display_value)}${isSelected ? '-selected' : ''}`}
                  />
                  {setName !== 'Color' && attr.display_value}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default AttributeSet;
