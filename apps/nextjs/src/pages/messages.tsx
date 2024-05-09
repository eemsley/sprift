import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";

import { GET_ALL_CONTACT_MESSAGES_ROUTE } from "~/utils/contants";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

type Message = {
  id: number;
  createdAt: Date;
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
};

interface MessagesPageProps {
  messages: Message[];
}

const Messages: NextPage<MessagesPageProps> = ({ messages }) => {
  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Sprift" />
      </Head>
      <div className="w-screen lg:h-screen">
        <Header />
        <main>
          <div className="flex justify-center pt-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="sm:flex sm:items-center sm:justify-center">
                <h2 className="text-secondary-900 mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
                  Messages
                </h2>
              </div>
              <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-10 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Email
                          </th>

                          <th
                            scope="col"
                            className="px-80 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Message
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {messages.map((message) => (
                          <tr key={message.id}>
                            {
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                {message.firstName && message.lastName
                                  ? `${message.firstName} ${message.lastName}`
                                  : "Not Provided"}
                              </td>
                            }

                            <td className="whitespace-nowrap px-10 py-4 text-sm text-gray-500">
                              {message.email}
                            </td>
                            <td className="whitespace-nowrap px-80 py-4 text-sm text-gray-500">
                              {message.message}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  messages: Message[];
}> = async () => {
  const res = await fetch(GET_ALL_CONTACT_MESSAGES_ROUTE, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const messages = await res.json();
  return {
    props: { messages },
  };
};

export default Messages;
