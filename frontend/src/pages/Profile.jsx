import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import SectionTitle from "../components/ui/SectionTitle";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { apiRequest, getToken } from "../lib/api";

const emptyAddress = {
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: ""
};

const Profile = ({ direction, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: emptyAddress
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/users/profile");
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: { ...emptyAddress, ...(data.address || {}) }
        });
      } catch (error) {
        setMessage(error.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSave = async () => {
    try {
      const updated = await apiRequest("/users/profile", {
        method: "PUT",
        body: {
          name: profile.name,
          phone: profile.phone,
          address: profile.address
        }
      });
      setProfile((prev) => ({ ...prev, ...updated.user }));
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to update profile");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await apiRequest("/users/change-password", {
        method: "PUT",
        body: password
      });
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password updated successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to update password");
    }
  };

  const token = getToken();

  if (!user && !loading && !token) {
    return (
      <PageTransition direction={direction} className="lux-gradient">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-24 pt-28">
          <SectionTitle
            eyebrow="Account"
            title="Sign in to view your profile"
            description="Access your saved details, shipping information, and password settings."
          />
          <Button onClick={() => navigate("/auth")}>Go to login</Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition direction={direction} className="lux-gradient">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-28">
        <SectionTitle
          eyebrow="Account"
          title="Profile settings"
          description="Manage your account details and shipping preferences."
        />

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
            Loading profile...
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-display text-2xl">Personal details</h3>
              <div className="mt-6 grid gap-4">
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
                <Input
                  label="Email"
                  value={profile.email}
                  disabled
                  className="cursor-not-allowed"
                />
                <Input
                  label="Phone"
                  placeholder="+1 555 123 4567"
                  value={profile.phone}
                  onChange={(event) =>
                    setProfile((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>

              <h4 className="mt-8 font-display text-xl">Shipping address</h4>
              <div className="mt-4 grid gap-4">
                <Input
                  label="Street"
                  value={profile.address.street}
                  onChange={(event) =>
                    setProfile((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: event.target.value }
                    }))
                  }
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="City"
                    value={profile.address.city}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: event.target.value }
                      }))
                    }
                  />
                  <Input
                    label="State"
                    value={profile.address.state}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, state: event.target.value }
                      }))
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Zip Code"
                    value={profile.address.zipCode}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, zipCode: event.target.value }
                      }))
                    }
                  />
                  <Input
                    label="Country"
                    value={profile.address.country}
                    onChange={(event) =>
                      setProfile((prev) => ({
                        ...prev,
                        address: { ...prev.address, country: event.target.value }
                      }))
                    }
                  />
                </div>
              </div>

              <Button className="mt-6" onClick={handleProfileSave}>
                Save profile
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-display text-2xl">Security</h3>
              <div className="mt-6 grid gap-4">
                <Input
                  label="Current password"
                  type="password"
                  value={password.currentPassword}
                  onChange={(event) =>
                    setPassword((prev) => ({
                      ...prev,
                      currentPassword: event.target.value
                    }))
                  }
                />
                <Input
                  label="New password"
                  type="password"
                  value={password.newPassword}
                  onChange={(event) =>
                    setPassword((prev) => ({
                      ...prev,
                      newPassword: event.target.value
                    }))
                  }
                />
                <Input
                  label="Confirm new password"
                  type="password"
                  value={password.confirmPassword}
                  onChange={(event) =>
                    setPassword((prev) => ({
                      ...prev,
                      confirmPassword: event.target.value
                    }))
                  }
                />
              </div>
              <Button className="mt-6" onClick={handlePasswordChange}>
                Update password
              </Button>
            </div>
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-xs uppercase tracking-[0.3em] text-gold/80">
            {message}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Profile;
