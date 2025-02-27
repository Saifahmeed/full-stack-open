const Header = ({ name }) => <h2>{name}</h2>;

const Part = ({ part: { name, exercises } }) => <p>{name} {exercises}</p>;

const Content = ({ parts }) => (
  <>
    {parts.map(({ id, ...part }) => <Part key={id} part={part} />)}
  </>
);

const Total = ({ parts }) => (
  <p><b>total of {parts.reduce((sum, { exercises }) => sum + exercises, 0)} exercises</b></p>
);

const Course = ({ course: { name, parts } }) => (
  <>
    <Header name={name} />
    <Content parts={parts} />
    <Total parts={parts} />
  </>
);

export default Course;
