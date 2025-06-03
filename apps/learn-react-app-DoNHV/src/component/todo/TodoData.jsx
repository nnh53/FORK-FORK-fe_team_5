const TodoData = (props) => {
  //props is a object
  /*
    {
        name: "Darwin",
        age: 21,
        data:{}
    }
    */
  const { todoList, deleteTodo } = props;
  //const name = props.name;
  //const age = props.age;
  //const data = props.data;

  const handleDelete = (id) => {
    console.log('handleDelete', id);
    deleteTodo(id);
  };
  console.log('TodoData render', props);
  return (
    <div className="todo-data">
      {todoList.map((item, index) => {
        return (
          <div className="todo-item" key={item.id}>
            <div>{item.name}</div>
            <button style={{ cursor: 'pointer' }} onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        );
      })}
      {/* <div>{JSON.stringify(todoList)}</div> */}
    </div>
  );
};

export default TodoData;
