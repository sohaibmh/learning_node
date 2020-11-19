import React, { Component } from "react";
import _ from "lodash";
import { reduxForm, Field } from "redux-form";
import SurveyField from "./SurveyField";
import { Link } from "react-router-dom";
import validateEmails from "../../utils/validateEmails";
import formFields from "./formFields";

class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {/* the handleSubmit function is from reduxForm*/}
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {/* the input of this field will be saved in redux under the key of surveyTitle as described in the name property */}
          {/* <Field type="text" name="surveyTitle" component="input" /> */}

          {this.renderFields()}

          <Link to="/surveys" className="red btn-flat white-text ">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.recipients = validateEmails(values.recipients || "");

  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      errors[name] = "You must provide a value";
    }
  });

  return errors;
}

// the destroyOnUnmount is the option whether to keep the values on the form or not, for example when you go to a next page and come back
export default reduxForm({
  validate,
  form: "surveyForm",
  destroyOnUnmount: false,
})(SurveyForm);
