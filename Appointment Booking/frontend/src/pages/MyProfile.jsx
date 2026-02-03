import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-lg mx-auto flex flex-col gap-6 text-sm">
        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer">
              <div className="relative">
                <img
                  className="w-36 h-36 rounded-full object-cover border-4 border-blue-200 opacity-80"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <img
                  src={assets.upload_icon}
                  className="w-10 absolute bottom-0 right-0 bg-primary p-2 rounded-full"
                  alt=""
                />
              </div>
              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          ) : (
            <img
              className="w-36 h-36 rounded-full object-cover border-4 border-blue-100"
              src={userData.image}
              alt=""
            />
          )}

          {isEdit && (
            <p className="text-xs text-gray-500">
              Click image to upload profile picture
            </p>
          )}
        </div>

        {/* Name */}
        <div className="text-center">
          {isEdit ? (
            <input
              className="text-xl font-semibold text-center bg-gray-50 border rounded-md px-3 py-1"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="text-3xl font-semibold">{userData.name}</p>
          )}
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-base font-semibold text-gray-700 mb-4">
            Personal Information
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-blue-600 font-medium">{userData.email}</p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              {isEdit ? (
                <input
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-50"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                />
              ) : (
                <p>{userData.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <p className="text-xs text-gray-500">Address</p>
              {isEdit ? (
                <div className="space-y-2 mt-1">
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line1: e.target.value,
                        },
                      }))
                    }
                  />
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          line2: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ) : (
                <p>
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-base font-semibold text-gray-700 mb-4">
            Basic Information
          </p>

          <div className="space-y-4">
            {/* Gender */}
            <div>
              <p className="text-xs text-gray-500">Gender</p>
              {isEdit ? (
                <select
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-50"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p>{userData.gender}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <p className="text-xs text-gray-500">Date of Birth</p>
              {isEdit ? (
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-gray-50"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      dob: e.target.value,
                    }))
                  }
                />
              ) : (
                <p>{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-4">
          {isEdit ? (
            <button
              onClick={updateUserProfileData}
              className="px-8 py-2 rounded-full bg-primary text-white hover:opacity-90"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-8 py-2 rounded-full border border-primary hover:bg-primary hover:text-white"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
