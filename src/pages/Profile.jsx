import React from "react";
import { useGetProfileQuery } from "../service/api";
import { Navigate } from "react-router";
import Loader from "../components/ui/LoadAnime";

const Profile = () => {
  const { data, isLoading } = useGetProfileQuery();

  if (isLoading) return <Loader />;

  if (!data) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container max-w-5xl mx-auto px-4">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={data.image}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {data.firstName} {data.lastName}
            </h1>

            <p className="text-gray-500">@{data.username}</p>

            <p className="mt-2 inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold capitalize">
              {data.role}
            </p>

            <div className="mt-3 text-sm text-gray-600">
              <p>{data.email}</p>
              <p>{data.phone}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          {/* Personal Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Personal Information
            </h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">Age:</span> {data.age}</p>
              <p><span className="font-semibold">Gender:</span> {data.gender}</p>
              <p><span className="font-semibold">Blood Group:</span> {data.bloodGroup}</p>
              <p><span className="font-semibold">Birth Date:</span> {data.birthDate}</p>
              <p><span className="font-semibold">University:</span> {data.university}</p>
              <p><span className="font-semibold">Eye Color:</span> {data.eyeColor}</p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Address
            </h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p>{data.address.address}</p>
              <p>{data.address.city}, {data.address.state}</p>
              <p>{data.address.postalCode}</p>
              <p>{data.address.country}</p>
            </div>
          </div>

          {/* Company */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Company
            </h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">Name:</span> {data.company.name}</p>
              <p><span className="font-semibold">Department:</span> {data.company.department}</p>
              <p><span className="font-semibold">Title:</span> {data.company.title}</p>
            </div>
          </div>

          {/* Bank */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Bank Details
            </h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">Card Type:</span> {data.bank.cardType}</p>
              <p><span className="font-semibold">Card Expire:</span> {data.bank.cardExpire}</p>
              <p><span className="font-semibold">Currency:</span> {data.bank.currency}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;