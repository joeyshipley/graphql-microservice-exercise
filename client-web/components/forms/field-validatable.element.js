export default function ValidatableField(props) {
  const { validations, property, children } = props;
  const errors = validations.filter((v) => v.property == property);

  return (
    <div>
      <div>{ children }</div>
      { errors && errors.map((e, i) => {
        return (
          <div role={ `${ property }-input-validation` } key={ `validation-error-${ i }` }>{ e.value }</div>
        );
      })}
    </div>
  )
}