"use client";
import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">About GoTogether</h1>

      <section className="mb-8 flex flex-col lg:flex-row items-center">
        <img
          src="/aboutImage1.jpg"
          alt="Our Mission"
          className="w-full lg:w-1/2 rounded-lg shadow-md mb-4 lg:mb-0 lg:mr-6"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600">
            At GoTogether, our mission is to simplify and enhance your travel experience by connecting riders and drivers within the IIT Indore community. We aim to promote eco-friendly and cost-effective ridesharing while building a trusted community of travelers.
          </p>
        </div>
      </section>

      <section className="mb-8 flex flex-col-reverse lg:flex-row items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Who We Are</h2>
          <p className="text-lg text-gray-600">
            We are a team of IIT Indore students passionate about creating a seamless platform for ride-sharing. GoTogether is built with a vision to foster safe and reliable transportation, reducing travel costs and our carbon footprint.
          </p>
        </div>
        <img
          src="/aboutImage2.jpg"
          alt="Who We Are"
          className="w-full lg:w-1/2 rounded-lg shadow-md mb-4 lg:mb-0 lg:ml-6"
        />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Why Choose GoTogether?</h2>
        <ul className="list-disc pl-6 text-lg text-gray-600 space-y-2">
          <li>Cost-Effective: Share your ride and split travel expenses.</li>
          <li>Eco-Friendly: Reduce carbon emissions by carpooling.</li>
          <li>Safe and Trusted: Verified users from the IIT Indore community.</li>
          <li>Convenient: Easy ride posting and search functionality.</li>
          <li>Community Driven: Connect with fellow students and staff.</li>
        </ul>
      </section>

      <section className="bg-gray-100 py-8 px-6 rounded-lg shadow-md flex flex-col lg:flex-row items-center">
        <img
          src="/cars-bg3.jpg"
          alt="Our Vision"
          className="w-full lg:w-1/2 rounded-lg shadow-md mb-4 lg:mb-0 lg:mr-6"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-600">
            We envision GoTogether as the preferred ride-sharing platform for IIT Indore students, fostering a culture of shared mobility, reducing solo rides, and making daily commutes more social and sustainable.
          </p>
        </div>
      </section>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-800">Join the Journey!</h2>
        <p className="text-lg text-gray-600 mt-4">
          Ready to ride smarter? Start sharing rides, meeting new friends, and saving money. <span className="text-blue-600 underline cursor-pointer">Get Started Now</span>.
        </p>
      </div>
    </div>
  );
};

export default About;
