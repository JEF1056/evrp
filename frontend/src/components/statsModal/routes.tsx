function RoutesDataComponent() {
  let destinations = ["hi", "hello"];
  return (
    <div className="overflow-y-auto max-h-[14rem] w-full bg-white md:max-h-[100rem]">

      <ul className="steps steps-vertical">
        {destinations.map(destination => (
          <li data-content="" className="step step-primary">{destination}</li>
        ))}
      </ul>
    </div>
  );
}

export default RoutesDataComponent;
