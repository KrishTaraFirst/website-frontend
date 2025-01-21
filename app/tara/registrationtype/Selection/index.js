"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  Tabs,
  Tab,
  Link,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Factory from "@/app/utils/Factory";
import IndividualForm from "../Individual";
import BusinessForm from "../Business";
import FirmForm from "../Firm";

const MovingCardTabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0); // Track selected tab index
  const [selectedType, setSelectedType] = useState(null); // Selected type for navigation
  const [dialogOpen, setDialogOpen] = useState(true); // Dialog open state
  const router = useRouter(); // Next.js router
  const [selectedUserType, setSelectedUserType] = useState(""); // Selected type for navigation

  const handleTabChange = (event, newValue) => {
    setSelectedIndex(newValue); // Set the selected tab index
  };

  const handleNext = async () => {
    console.log(selectedType);

    try {
      const url = `/user_management/update-users-info`;
      const postData = { user_type: selectedType };

      const { res, error } = await Factory("patch", url, postData);
      console.log(res);
      if (res.status_cd === 0) {
        setDialogOpen(false);

        const userDetails = JSON.parse(localStorage.getItem("user"));

        userDetails.user_type = selectedType;

        localStorage.setItem("user", JSON.stringify(userDetails));
        setSelectedUserType(selectedType);
      } else {
        alert("Something went Wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const getTabLabel = (label, desc, flag) => {
    return (
      <>
        <h6 style={{ margin: 0, textAlign: "center", color: !flag && "#666" }}>
          {label}
        </h6>
        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "center" }}
          color={"disabled"}
          id="dialog-description"
        >
          {desc}
        </Typography>
      </>
    );
  };
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    console.log(userDetails);

    if (!userDetails.user_kyc) {
      setSelectedUserType(userDetails.user_type);
    }
  }, [selectedType]);
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            padding: "16px",
          },
        }}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <h4 style={{ mb: 2, textAlign: "center" }}>
          Welcome aboard, let's get started!
        </h4>

        <Typography
          variant="body1"
          sx={{ mb: 4, textAlign: "center" }}
          color="disabled"
          id="dialog-description"
        >
          Pick your account type to proceed.
        </Typography>

        <Tabs
          value={selectedIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{
            p: 0.5,
            position: "relative",
            transition: "transform 0.6s ease-in-out",
            "& .MuiTabs-indicator": {},
            backgroundColor: "#d7d9db",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            display: "flex",
            flexWrap: "wrap", // Allow tabs to wrap when screen shrinks
            justifyContent: "center", // Center-align content
          }}
        >
          <Tab
            label={getTabLabel(
              "Business",
              " Streamlining business operations, compliance with financial regulations for efficient management and growth.",
              selectedIndex === 0
            )}
            sx={{
              textTransform: "none",
              padding: "30px 20px", // Reduce padding for smaller screens
              minWidth: "150px", // Set a minimum width
              flex: "1 1 auto", // Flex-grow for responsiveness
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              boxShadow:
                selectedIndex === 0 ? "0 4px 10px rgba(0, 0, 0, 0.2)" : "none",
              backgroundColor: selectedIndex === 0 ? "white" : "#d7d9db",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => setSelectedType("business")}
          />
          <Tab
            label={getTabLabel(
              "Tax Consultant",
              "Provides tax advice and support to individuals, businesses, and organizations",
              selectedIndex === 1
            )}
            sx={{
              textTransform: "none",
              padding: "30px 20px", // Reduce padding for smaller screens
              minWidth: "150px", // Set a minimum width
              flex: "1 1 auto", // Flex-grow for responsiveness
              // borderRadius: 2,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              boxShadow:
                selectedIndex === 1 ? "0 4px 10px rgba(0, 0, 0, 0.2)" : "none",
              backgroundColor: selectedIndex === 1 ? "white" : "#d7d9db",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => setSelectedType("cafirm")}
          />
          <Tab
            label={getTabLabel(
              "Tax Consultant",
              "Provides tax advice and support to individuals, businesses, and organizations",
              selectedIndex === 1
            )}
            sx={{
              textTransform: "none",
              padding: "30px 20px", // Reduce padding for smaller screens
              minWidth: "150px", // Set a minimum width
              flex: "1 1 auto", // Flex-grow for responsiveness
              // borderRadius: 2,
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              boxShadow:
                selectedIndex === 1 ? "0 4px 10px rgba(0, 0, 0, 0.2)" : "none",
              backgroundColor: selectedIndex === 1 ? "white" : "#d7d9db",
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => setSelectedType("individual")}
          />
        </Tabs>

        {/* Next Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Link
            color="primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedType("individual");
              setDialogOpen(false);

              // handleNext();
            }}
            sx={{ mr: 2 }}
          >
            Skip if you're an Individual
          </Link>

          <Button
            variant="contained"
            color="primary"
            sx={{ px: 5 }}
            onClick={handleNext}
            disabled={!selectedType}
          >
            Next
          </Button>
        </Box>
      </Dialog>
      {(() => {
        switch (selectedUserType) {
          case "individual":
            return <IndividualForm />;
          case "business":
            return <BusinessForm />;
          case "cafirm":
            return <FirmForm />;
          default:
            return null;
        }
      })()}
    </>
  );
};

export default MovingCardTabs;
