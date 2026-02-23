import moment from "moment";

const now = (mode: "unix" | "millisecond" | "mysql" | "response" | string) => {
  const m = moment();

  switch (mode) {
  case "millisecond":
    return m.valueOf().toString();
  case "mysql":
    return m.utc().format("YYYY-MM-DD HH:mm:ss");
  case "response":
    return m.utc().format("YYYY-MM-DDTHH:mm:ssZZ");
  case "unix":
    return m.utc().unix().toString();
  case "yearNow":
    return m.utc().format("YYYY");
  }

  return m.valueOf().toString();
};

export {now};
