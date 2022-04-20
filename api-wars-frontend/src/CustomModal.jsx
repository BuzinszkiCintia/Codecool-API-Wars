import React, { useEffect } from "react";
import { useState } from "react";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { withStyles } from "@material-ui/core/styles";

const CustomModal = (props) => {
  const { planet } = props;
  const [open, setOpen] = useState(false);
  const [residents, setResidents] = useState([]);

  const WhiteTextTable = withStyles({
    root: {
      color: "#FFFFFF",
    },
  })(Table);

  const fetchResidents = (planet) => {
    planet?.residents.map(async (resident) => {
      const response = await fetch(resident);
      const resJson = await response.json();
      setResidents((residents) => [...residents, resJson]);
    });
  };

  useEffect(() => {
    fetchResidents(planet);
  }, [planet]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: props.theme.palette.primary.dark,
    color: props.theme.palette.primary.light,
    border: "2px solid #000",
    boxShadow: 10,
    p: 4,
  };

  return (
    <>
      {planet.residents.length > 0 ? (
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          <Typography
            variant="caption"
            component="div"
            color="primary"
            sx={{ flexGrow: 1 }}
          >
            {planet.residents.length === 1
              ? `${planet.residents.length} resident`
              : `${planet.residents.length} residents`}
          </Typography>
        </Button>
      ) : (
        "No known residents"
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        BackdropProps={{
          style: { backgroundColor: "rgba(0,0,0,0.05)" },
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
          <TableContainer>
            <WhiteTextTable>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Height</TableCell>
                  <TableCell>Mass</TableCell>
                  <TableCell>Hair color</TableCell>
                  <TableCell>Skin color</TableCell>
                  <TableCell>Eye color</TableCell>
                  <TableCell>Birth year</TableCell>
                  <TableCell>Gender</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {residents?.map((resident, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{resident.name}</TableCell>
                      <TableCell>{resident.height}</TableCell>
                      <TableCell>{resident.mass}</TableCell>
                      <TableCell>{resident.hair_color}</TableCell>
                      <TableCell>{resident.skin_color}</TableCell>
                      <TableCell>{resident.eye_color}</TableCell>
                      <TableCell>{resident.birth_year}</TableCell>
                      <TableCell>{resident.gender}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </WhiteTextTable>
          </TableContainer>
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;
