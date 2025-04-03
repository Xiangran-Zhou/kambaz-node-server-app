export default function QueryParameters(app) {
  app.get("/lab5/calculator", (req, res) => {
    const { a, b, operation } = req.query;
    let result = 0;
    const numA = parseInt(a);
    const numB = parseInt(b);

    switch (operation) {
      case "add":
        result = numA + numB;
        break;
      case "subtract":
        result = numA - numB;
        break;
      case "multiply":
        result = numA * numB;
        break;
      case "divide":
        if (numB === 0) {
          result = "Division by zero is not allowed";
        } else {
          result = numA / numB;
        }
        break;
      default:
        result = "Invalid operation";
    }
    res.send(result.toString());
  });
}
