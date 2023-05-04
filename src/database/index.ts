import { connect } from "mongoose";

export async function setup() {
  return await connect(
    "mongodb+srv://zero:asif@cluster0.ec7mgai.mongodb.net/?retryWrites=true&w=majority"
  );
}
