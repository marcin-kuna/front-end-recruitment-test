/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

Route.get("/", async ({ view }) => {
  return view.render("index");
});

Route.get("/bacon", async ({ view }) => {
  return view.render("bacon");
});

Route.get("/checkout", async ({ view }) => {
  const state = {
    cart: {
      items: [
        { name: "Apple Watch Sport", price: 580 },
        { name: "Modern Buckle", price: 380 },
      ],
      totals: {
        subTotal: 960,
        tax: 0,
        grandTotal: 960,
      },
    },
  };

  return view.render("checkout", state);
});

Route.post("/order", async ({ request, response, session }) => {
  const orderSchema = schema.create({
    firstName: schema.string({}, [rules.alpha()]),
    lastName: schema.string({}, [rules.alpha()]),
    email: schema.string({}, [rules.email()]),
    country: schema.string(),
    postalCode: schema.string({}, [rules.regex(new RegExp("^[0-9]{5}$"))]),
    phone: schema.string({}, [rules.mobile()]),
    creditCard: schema.string({}, [rules.regex(new RegExp("^[0-9]{16}$"))]),
    CVV: schema.string({}, [rules.regex(new RegExp("^[0-9]{3}$"))]),
    expDate: schema.string({}, [
      rules.regex(new RegExp("^[0-9]{2}/[0-9]{2}$")),
    ]),
  });

  try {
    await request.validate({
      schema: orderSchema,
      messages: {
        "firstName.required": "Your first name is required",
        "firstName.alpha": "First name should only contain letters",
        "lastName.required": "Your last name is required",
        "lastName.alpha": "Last name should only contain letters",
        "email.required": "Your email is required",
        "email.email": "Email is not formatted correctly",
        "postalCode.required": "Your postal code is required",
        "postalCode.regex": "Postal code acceptable format: 00123",
        "phone.required": "Your phone number is required",
        "phone.regex": "Phone number acceptable format: 123123123",
        "creditCard.required": "Your credit card number is required",
        "creditCard.regex":
          "Credit card number acceptable format: 1234123412341234",
        "CVV.required": "Your credit card CVV number is required",
        "CVV.regex": "Credit card CVV number acceptable format: 123",
        "expDate.required": "Your credit card expiration date is required",
        "expDate.regex": "Credit card expiration date acceptable format: 00/00",
      },
    });
    return `<div style="position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60vw"><p style="text-transform:uppercase; color: green; font-weight: bold; font-size: 50px; font-family: Trebuchet MS">Order successfully placed!🎉</p></div>`;
  } catch (error) {
    if ((error.status = "Error 422")) {
      session.flash("message", error.messages);
      response.redirect().back();
    } else {
      return `<div style="position:absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"></p><span style="text-transform:uppercase; color: red; font-weight: bold; font-size: 50px; font-family: Trebuchet MS">Error ${error.status}🛑</span></div>`;
    }
  }
});
