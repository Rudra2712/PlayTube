import React, { useState } from "react";
import { axiosInstance } from "../../helpers/axios.helper";
import { toast } from "react-toastify";

function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/users/change-password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });

      toast.success("Password changed successfully");
      handleCancel();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold">Password</h5>
        <p className="text-gray-300">Please enter your current password to change your password.</p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <div className="rounded-lg border">
          <div className="flex flex-wrap gap-y-4 p-4">
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="old-pwd">
                Current password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="old-pwd"
                name="oldPassword"
                placeholder="Current password"
                value={formData.oldPassword}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="new-pwd">
                New password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="new-pwd"
                name="newPassword"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <p className="mt-0.5 text-sm text-gray-300">
                Your new password must be more than 8 characters.
              </p>
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="cnfrm-pwd">
                Confirm password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="cnfrm-pwd"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <hr className="border border-gray-300" />
          <div className="flex items-center justify-end gap-4 p-4">
            <button 
              className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;