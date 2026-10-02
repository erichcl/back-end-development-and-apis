import express from "express";
import cors from "cors";

function isValidTimestamp(n) {
  return typeof n === 'number' && Number.isFinite(n) && !isNaN(new Date(n).getTime());
}

function isValidDateString(str) {
  return typeof str === 'string' && !isNaN(Date.parse(str));
}

function parseDate(date_or_timestamp) {
  if (isValidDateString(date_or_timestamp)) {
    return new Date(date_or_timestamp);
  } else if (isValidTimestamp(Number.parseInt(date_or_timestamp))) {
    return new Date(Number.parseInt(date_or_timestamp));
  } else {
    throw new Error("Invalid Date");}
}

function buildResponse(date) {
  const unix = Math.floor( date.getTime());
  const utc = date.toUTCString();
  return { unix: unix, utc: utc};
}

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html");
});

// Do not change code above this line
const dateRouter = express.Router();
dateRouter.get('/', (req, res) => {
    res.send(buildResponse(new Date(Date.now())));
});

dateRouter.get('/:date', (req, res) => {
  const date = parseDate(req.params.date);
  res.send(buildResponse(date));
});



app.use('/api', dateRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ error: "Invalid Date" })
})
// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
