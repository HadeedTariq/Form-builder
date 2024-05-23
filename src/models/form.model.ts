import mongoose, { Document, Schema } from "mongoose";

interface IForm extends Document {
  userId: string;
  createdAt: Date;
  published: boolean;
  name: string;
  description: string;
  content: string;
  visits: number;
  submissions: number;
  shareURL: string;
  formSubmissions: mongoose.Types.ObjectId[];
}

const FormSchema: Schema<IForm> = new mongoose.Schema({
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  content: { type: String, default: "[]" },
  visits: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  shareURL: { type: String, unique: true, default: "" },
  formSubmissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FormSubmissions" },
  ],
});

FormSchema.index({ name: 1, userId: 1 }, { unique: true });

const Form = mongoose.models.Form || mongoose.model<IForm>("Form", FormSchema);

export default Form;
