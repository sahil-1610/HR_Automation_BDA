import React from "react";

function HeroSection() {
  return (
    <section className="bg-gray-100 py-20 px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Unlock Your Business Potential
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Empowering businesses with tailored digital solutions that drive
          growth and maximize impact. From strategic consulting to advanced tech
          services, we’re your dedicated growth partner.
        </p>
        <p className="mt-4 text-lg text-gray-600">
          Whether you're a startup or an established enterprise, our expertise
          in digital transformation will help you navigate and excel in today’s
          fast-paced market.
        </p>
        <button className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Learn More
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
