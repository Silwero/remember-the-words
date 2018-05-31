import React from 'react';

const name = (props) => (
  <div className="translations-list-tanslation">
    {props.translation.variants ? <span title="Show more variants" onClick={(e) => props.click(e.target)} className="toggle-variants"></span> : null}
    <span className="delete text-danger" onClick={() => props.delete(props.target)}>X</span>
    <div className="translation-source">
      {props.translation.source}
    </div>
    <div className="translation-result">
      {props.translation.translation}
    </div>
    {
      props.translation.variants
      ? <div className="translation-variants">
        {props.translation.variants.join(', ')}
      </div>
      : null
    }

  </div>
);

export default name;