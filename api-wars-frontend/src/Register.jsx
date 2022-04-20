import { useState } from "react";

import Box from "@mui/material/Box";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

import { Grid } from "@mui/material";

const signup = (userName, password) => {
  let status = true;

  return fetch("/register", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ userName, password }),
  })
    .then((res) => {
      if (!res.ok) {
        status = false;
      }
      return res;
    })
    .then((res) => {
      return res.json();
    })
    .then((info) => {
      if (status) {
        return info;
      }
      throw info;
    });
};

const Register = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [helperText, setHelperText] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleSignUp = (userName, password) => {
    setError(null);
    setLoading(true);
    signup(userName, password)
      .then(() => {
        props.onSuccess();
      })
      .then(() => navigate("/login"))
      .catch((err) => {
        setError(err);
        setHelperText(err.message);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setUserName("");
        setPassword("");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName || password) {
      return handleSignUp(userName, password);
    }
  };

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
      width="100%"
      height="100%"
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} md={6} lg={3} m={1} pt={1}>
          <Typography variant="h3" gutterBottom component="div">
            Registration
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={3} m={1} pt={5}>
          <FormControl variant="filled">
            <InputLabel htmlFor="component-filled" color="secondary">
              Username
            </InputLabel>
            <FilledInput
              id="component-filled"
              type="text"
              className="input"
              value={userName}
              onChange={handleUserNameChange}
              disabled={loading}
              color="secondary"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={3} m={3} pt={2}>
          <FormControl variant="filled">
            <InputLabel htmlFor="component-filled2" color="secondary">
              Password
            </InputLabel>
            <FilledInput
              id="component-filled2"
              type="password"
              className="input"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              color="secondary"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={3} m={3} pt={2}>
          <FormHelperText sx={{ color: props.theme.palette.warning.main }}>
            {helperText}
          </FormHelperText>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            Register
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
