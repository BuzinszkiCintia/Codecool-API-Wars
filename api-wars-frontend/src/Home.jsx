import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { ButtonGroup, Grid, Typography } from "@mui/material";

import CustomModal from "./CustomModal";

const Home = (props) => {
  const [planets, setPlanets] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`https://swapi.dev/api/planets/?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setPlanets(data);
      });
  }, []);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const fetchNext = () => {
    fetch(planets.next)
      .then((response) => response.json())
      .then((data) => {
        setPlanets(data);
        setPage(page + 1);
      });
  };

  const fetchPrev = () => {
    fetch(planets.previous)
      .then((response) => response.json())
      .then((data) => {
        setPlanets(data);
        setPage(page - 1);
      });
  };

  const style = {
    color: props.theme.palette.primary.light,
  };

  return (
    <div>
      <Typography variant="h3" sx={{ ml: 4 }}>
        {" "}
        Star Wars Universe Planets
      </Typography>
      <ButtonGroup
        variant="text"
        aria-label="text button group"
        color="secondary"
        sx={{ mt: 3, mb: 3 }}
      >
        <Button sx={{ pr: 4, pl: 4 }} onClick={fetchPrev} disabled={page === 1}>
          Prev
        </Button>
        <Button onClick={fetchNext} sx={{ pr: 4, pl: 4 }}>
          Next
        </Button>
      </ButtonGroup>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <TableContainer
          component={Paper}
          className="container"
          color="white"
          sx={{ mx: "auto", maxWidth: 1000, p: 1, m: 1 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Diameter</TableCell>
                <TableCell>Climate</TableCell>
                <TableCell>Terrain</TableCell>
                <TableCell>Surface Water Percentage</TableCell>
                <TableCell>Population</TableCell>
                <TableCell>Residents</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planets.results?.map((planet) => (
                <TableRow
                  key={planet.name}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {planet.name}
                  </TableCell>
                  <TableCell>{`${numberWithCommas(
                    planet.diameter
                  )} km`}</TableCell>
                  <TableCell>{planet.climate}</TableCell>
                  <TableCell>{planet.terrain}</TableCell>
                  <TableCell>
                    {planet.surface_water === "unknown"
                      ? planet.surface_water
                      : `${planet.surface_water}%`}
                  </TableCell>
                  <TableCell>
                    {planet.population === "unknown"
                      ? planet.population
                      : `${numberWithCommas(planet.population)} people`}
                  </TableCell>
                  <TableCell>
                    <CustomModal planet={planet} theme={props.theme} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default Home;
