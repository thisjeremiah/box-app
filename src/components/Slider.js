import React from 'react'

/* stateless components */

const Slider = ({ name, onChange, value }) =>
  <div>
    <h1>
      {name}: {value}
    </h1>
    <input
      name={name}
      onChange={onChange}
      type="range"
      min="1"
      max="100"
      value={value}
    />
  </div>

export default Slider
