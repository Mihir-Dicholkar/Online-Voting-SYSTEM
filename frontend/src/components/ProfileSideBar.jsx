// src/components/ProfileSidebar.jsx
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faUserCircle,
  faCheckCircle,
  faExclamationCircle,
  faArrowRight,
  faArrowLeft,
  faIdCard,
  faMapMarkerAlt,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const districtsMaharashtra = [
  "Mumbai City", "Mumbai Suburban", "Thane", "Palghar", "Raigad", "Ratnagiri", "Sindhudurg",
  "Pune", "Satara", "Sangli", "Kolhapur", "Solapur", "Ahmednagar", "Nashik", "Dhule", "Jalgaon", "Nandurbar",
  "Aurangabad", "Jalna", "Beed", "Parbhani", "Hingoli", "Nanded", "Latur", "Osmanabad",
  "Amravati", "Akola", "Washim", "Buldhana", "Yavatmal", "Wardha", "Nagpur", "Bhandara", "Gondia", "Chandrap ", "Chandrapur", "Gadchiroli"

];

const ProfileSidebar = ({ isProfileSidebarOpen, toggleProfileSidebar }) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [loading, setLoading] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(null); // ← MISSING!
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  });

  const [verificationDetails, setVerificationDetails] = useState({
    voterId: '',
    aadharCard: '',
  });

  const [locationDetails, setLocationDetails] = useState({
    district: '',
    taluka: '',
    city: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user || !isProfileSidebarOpen) return;

      try {
        const token = await getToken();
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.profileCompleted) {
          setIsProfileCompleted(true);
          // Prefill data for display
          const u = res.data;
          setPersonalDetails({
            fullName: u.fullName || '',
            email: u.email || '',
            phone: u.phone || '',
            dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
          });
          setVerificationDetails({
            voterId: u.voterId || '',
            aadharCard: u.aadharCard ? `XXXX XXXX ${u.aadharCard.slice(-4)}` : '',
          });
          setLocationDetails({
            district: u.district || '',
            taluka: u.taluka || '',
            city: u.city || '',
          });
        } else {
          setIsProfileCompleted(false);
        }
      } catch (err) {
        console.error("Failed to check profile:", err);
        setIsProfileCompleted(false);
      }
    };

    checkProfileStatus();
  }, [user, isProfileSidebarOpen, getToken]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocationDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = () => {
    let newErrors = {};

    if (step === 1) {
      if (!personalDetails.fullName.trim()) newErrors.fullName = 'Full Name is required';
      if (!personalDetails.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email))
        newErrors.email = 'Invalid email';
      if (!personalDetails.phone.trim()) newErrors.phone = 'Phone is required';
      else if (!/^\d{10}$/.test(personalDetails.phone))
        newErrors.phone = 'Must be 10 digits';
      if (!personalDetails.dateOfBirth) newErrors.dateOfBirth = 'DOB is required';
    }

    if (step === 2) {
      if (!verificationDetails.voterId.trim()) newErrors.voterId = 'Voter ID required';
      if (!verificationDetails.aadharCard.trim()) newErrors.aadharCard = 'Aadhar required';
      else if (!/^\d{12}$/.test(verificationDetails.aadharCard.replace(/\s/g, '')))
        newErrors.aadharCard = 'Aadhar must be 12 digits';
    }

    if (step === 3) {
      if (!locationDetails.district) newErrors.district = 'Select district';
      if (!locationDetails.taluka.trim()) newErrors.taluka = 'Taluka required';
      if (!locationDetails.city.trim()) newErrors.city = 'City/Village required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
    setErrors({});
  };

const handleSaveAll = async (e) => {
  e.preventDefault();

  // 🔒 FRONTEND LOCK
  if (isProfileCompleted) {
    toast.error("Profile is already completed and cannot be edited");
    return;
  }

  if (!validateStep()) return;

  setLoading(true);
  try {
    const token = await getToken();

    await axios.post(
      "http://localhost:5000/api/users/complete-profile",
      {
        fullName: personalDetails.fullName,
        email: personalDetails.email,
        phone: personalDetails.phone,
        dateOfBirth: personalDetails.dateOfBirth,
        voterId: verificationDetails.voterId,
        aadharCard: verificationDetails.aadharCard.replace(/\s/g, ''),
        district: locationDetails.district,
        taluka: locationDetails.taluka,
        city: locationDetails.city,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Profile completed successfully!");
    toggleProfileSidebar();
    window.location.reload();

  } catch (err) {
    const status = err.response?.status;
    const msg = err.response?.data?.message;

if (status === 403) {
  toast.error("Profile already completed and locked");
  setIsProfileCompleted(true);
  return;
}


    toast.error(msg || "Failed to save profile");
  } finally {
    setLoading(false);
  }
};


  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
              <FontAwesomeIcon icon={faUserCircle} /> Personal Details
            </h3>
            <input type="text" name="fullName" placeholder="Full Name" value={personalDetails.fullName} onChange={handlePersonalChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-4 focus:ring-blue-100`} />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

            <input type="email" name="email" placeholder="Email Address" value={personalDetails.email} onChange={handlePersonalChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <input type="tel" name="phone" placeholder="Phone (10 digits)" value={personalDetails.phone} onChange={handlePersonalChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <input type="date" name="dateOfBirth" value={personalDetails.dateOfBirth} onChange={handlePersonalChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300" />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
              <FontAwesomeIcon icon={faIdCard} /> Identity Verification
            </h3>
            <input type="text" name="voterId" placeholder="Voter ID (e.g. ABC1234567)" value={verificationDetails.voterId} onChange={handleVerificationChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.voterId ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.voterId && <p className="text-red-500 text-sm">{errors.voterId}</p>}

            <input type="text" name="aadharCard" placeholder="Aadhar Card (12 digits)" value={verificationDetails.aadharCard} onChange={handleVerificationChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.aadharCard ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.aadharCard && <p className="text-red-500 text-sm">{errors.aadharCard}</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> Voting Location
            </h3>
            <select name="district" value={locationDetails.district} onChange={handleLocationChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.district ? 'border-red-500' : 'border-gray-300'}`}>
              <option value="">Select District</option>
              {districtsMaharashtra.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}

            <input type="text" name="taluka" placeholder="Taluka" value={locationDetails.taluka} onChange={handleLocationChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.taluka ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.taluka && <p className="text-red-500 text-sm">{errors.taluka}</p>}

            <input type="text" name="city" placeholder="City / Village" value={locationDetails.city} onChange={handleLocationChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
        );

      default: return null;
    }


  };
   if (isProfileCompleted === null) {
    return (
      <div className={`fixed inset-0 bg-black/50 z-50 flex justify-end ${isProfileSidebarOpen ? 'visible' : 'invisible'}`}>
        <div className="w-full max-w-md bg-white h-screen flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-blue-600 mb-4" />
            <p className="text-xl text-gray-700">Checking profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // PROFILE COMPLETED — SUCCESS SCREEN
  if (isProfileCompleted) {
    return (
      <div className={`fixed inset-0 bg-black/50 z-50 flex justify-end ${isProfileSidebarOpen ? 'visible' : 'invisible'}`}>
        <div className="w-full max-w-md bg-gradient-to-br from-emerald-50 to-green-100 shadow-2xl">
          <div className="p-10 h-screen flex flex-col items-center justify-center text-center">
            <FontAwesomeIcon icon={faCircleCheck} className="text-9xl text-green-600 mb-6" />
            <h2 className="text-4xl font-bold text-green-800 mb-4">Profile Completed!</h2>
            <p className="text-xl text-green-700 mb-10">You are ready to vote in {locationDetails.district}</p>

            <div className="bg-white rounded-2xl p-8 w-full shadow-lg space-y-4">
              <p><strong>Name:</strong> {personalDetails.fullName}</p>
              <p><strong>District:</strong> <span className="text-green-700 font-bold">{locationDetails.district}</span></p>
              <p><strong>Voter ID:</strong> {verificationDetails.voterId}</p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-green-700">
              <FontAwesomeIcon icon={faLock} />
              <span>Profile locked • Secure & Verified</span>
            </div>

            <button
              onClick={toggleProfileSidebar}
              className="mt-10 px-12 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/50 z-50 flex justify-end ${isProfileSidebarOpen ? 'visible' : 'invisible'}`}>
      <div className={`w-full max-w-md bg-white shadow-2xl transform transition-transform duration-500 ${isProfileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 h-screen flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-800">Complete Your Profile</h2>
            <button onClick={toggleProfileSidebar} disabled={loading} className="text-gray-500 hover:text-red-600 text-2xl">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
              <span>Step {step} of {totalSteps}</span>
              {step === 3 && Object.keys(errors).length === 0 && <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-20">
            {renderFormStep()}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              {step > 1 && (
                <button onClick={handlePrev} className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition">
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Previous
                </button>
              )}
              {step < totalSteps ? (
                <button onClick={handleNext} className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                  Next <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </button>
              ) : (
         <button
  onClick={handleSaveAll}
  disabled={loading || isProfileCompleted}
  className={`ml-auto px-4 py-4 font-bold text-lg rounded-xl transition flex items-center gap-3 shadow-lg
    ${isProfileCompleted
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
    }`}
>

                  {loading ? (
                    <>Saving... <FontAwesomeIcon icon={faSpinner} spin /></>
                  ) : (
                    <> {isProfileCompleted ? "Profile Locked" : "Complete Profile"} <FontAwesomeIcon icon={faCheckCircle} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;