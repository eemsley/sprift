import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

import { SEND_CONTACT_MESSAGE_ROUTE } from "~/utils/contants";

interface ContactFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ContactForm = () => {
  const [agreed, setAgreed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();
  const onSubmit: SubmitHandler<ContactFormInputs> = (data) => {
    const { firstName, lastName, email, message } = data;

    fetch(SEND_CONTACT_MESSAGE_ROUTE, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, message }),
    })
      .then((_) => {
        reset();
        toast.success("Thank you for contacting Sprift!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error has occured. Please try again later.");
      });
  };

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 max-w-xl sm:mt-10"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-satoshi-semibold leading-6 text-gray-900"
          >
            First name
          </label>
          <div className="mt-2.5">
            <input
              {...register("firstName")}
              type="text"
              name="firstName"
              id="firstName"
              autoComplete="given-name"
              className="focus:ring-primary-400 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-satoshi-semibold leading-6 text-gray-900"
          >
            Last name
          </label>
          <div className="mt-2.5">
            <input
              {...register("lastName")}
              type="text"
              name="lastName"
              id="lastName"
              autoComplete="family-name"
              className="focus:ring-primary-400 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-satoshi-semibold leading-6 text-gray-900"
          >
            Email *
          </label>
          <div className="mt-2.5">
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              className="focus:ring-primary-400 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            />
            {errors.email && (
              <div className="mt-1">
                <span className="text-sm font-general-sans-regular text-red-500">
                  ⓘ Email address is required
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-satoshi-semibold leading-6 text-gray-900"
          >
            Message *
          </label>
          <div className="mt-2.5">
            <textarea
              {...register("message", { required: true })}
              name="message"
              id="message"
              rows={4}
              className="focus:ring-primary-400 block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              defaultValue={""}
            />
            {errors.message && (
              <div className="mt-1">
                <span className="text-sm font-general-sans-regular text-red-500">
                  ⓘ Message is required
                </span>
              </div>
            )}
          </div>
        </div>
        <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
          <div className="flex h-6 items-center">
            <Switch
              checked={agreed}
              onChange={setAgreed}
              className={classNames(
                agreed ? "bg-primary-500" : "bg-gray-200",
                "focus-visible:outline-accent-600 flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
              )}
            >
              <span className="sr-only">Agree to policies</span>
              <span
                aria-hidden="true"
                className={classNames(
                  agreed ? "translate-x-3.5" : "translate-x-0",
                  "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out",
                )}
              />
            </Switch>
          </div>
          <Switch.Label className="text-sm font-general-sans-regular leading-6 text-gray-600">
            By selecting this, you agree to our{" "}
            <a href="#" className="text-primary-800 font-semibold">
              privacy&nbsp;policy
            </a>
            .
          </Switch.Label>
        </Switch.Group>
      </div>
      <div className="mt-10">
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-500 focus-visible:outline-secondary-500 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-satoshi-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Let&apos;s talk
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
