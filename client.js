const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:40001", grpc.credentials.createInsecure());
const text = process.argv[2];

client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    console.log("Received from server" + JSON.stringify(response))
})

// client.readTodos({}, (err, response) => {
//     if (!response.items)
//         console.log("From server, all todos " + JSON.stringify(response))
// })

const call = client.readTodosStream();
call.on("data", item => {
    console.log("Received stream from server" + JSON.stringify(item))
})

call.on("end", e => {
    console.log("Done!!")
})