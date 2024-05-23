import mongoose, { Document, Schema } from "mongoose";

interface IFormSubmission extends Document {
  createdAt: Date;
  formId: mongoose.Types.ObjectId;
  content: string;
}

const FormSubmissionSchema: Schema<IFormSubmission> = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  formId: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  content: { type: String, required: true },
});

const FormSubmission =
  mongoose.models.FormSubmission ||
  mongoose.model<IFormSubmission>("FormSubmission", FormSubmissionSchema);

export default FormSubmission;
