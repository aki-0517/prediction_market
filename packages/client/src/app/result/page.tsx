import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Result = () => {
  return (
    <>
      <Head>
        <title>Success!</title>
        <meta name="description" content="Operation was successful" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Success!</h1>
          <p className="mb-8 text-lg text-gray-700">
            Your operation was completed successfully.
          </p>
          <Link href="/" className="inline-block px-6 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg">
              Home Page
          </Link>
        </div>
      </div>
    </>
  );
};

export default Result;
