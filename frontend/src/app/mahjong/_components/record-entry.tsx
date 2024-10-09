"use client";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Popover,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MahjongGameRecord } from "@/types/mahjong";
import React, { useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { deleteRecord } from "./actions";
import { useSnackbar } from "notistack";
import { text } from "@/lib/data";
import { useSession } from "next-auth/react";
import { Role, RoleType } from "@/types/auth";

class MahjongRecordEntryProps extends MahjongGameRecord {}

const initialState = {
  message: "",
};

export function RecordEntry({
  id,
  category,
  subcategory,
  players,
  note,
}: MahjongRecordEntryProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = () => {
    const requiredRoles: RoleType[] = [Role.ADMIN, Role.MAHJONG_RECORD_ADMIN];
    if (!session?.user) {
      enqueueSnackbar(text.error.noSession, { variant: "error" });
      return;
    }
    const roles = (session?.user as any).roles;
    const intersect = roles.filter((role: RoleType) => {
      return requiredRoles.includes(role);
    });
    if (intersect.length === 0) {
      enqueueSnackbar(text.error.noRole, { variant: "error" });
    } else {
      setDialogOpen(true);
    }
  };

  const handleDialogClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDialogOpen(false);
  };

  const handleDeleteConfirm = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const isRequestSucceed = await deleteRecord(id);
    if (isRequestSucceed) {
      enqueueSnackbar(text.mahjong.deleteRecord.success, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(text.mahjong.deleteRecord.error, { variant: "error" });
    }
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "simple-popover" : undefined;

  return (
    <ListItem>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          backgroundColor: note ? "#BBFFBB" : "#FFFFFF",
        }}
      >
        <Grid container spacing={2} sx={{ width: "100%", padding: "0.3rem" }}>
          <Grid size={12}>
            <Typography component="div" noWrap sx={{ fontSize: "0.8rem" }}>
              {`${category} ${subcategory}`}
            </Typography>
          </Grid>
          <IconButton
            size="small"
            color="inherit"
            onClick={handlePopoverOpen}
            sx={{ position: "absolute", right: "20px" }}
          >
            <MoreVert />
          </IconButton>
          {players.map(({ playerName, nickname, score }) => (
            <Grid size={6} key={playerName} sx={{ padding: "0.3rem" }}>
              <Typography component="div" noWrap>
                {nickname}
              </Typography>
              <Typography component="div">{score}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Popover
        id={popoverId}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleDialogOpen}>
              <Typography sx={{ p: 2 }}>
                {text.mahjong.deleteRecord.title}
              </Typography>
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {text.mahjong.deleteRecord.confirmTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text.mahjong.deleteRecord.confirmText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{text.common.cancel}</Button>
          <Button onClick={handleDeleteConfirm}>{text.common.delete}</Button>
        </DialogActions>
      </Dialog>
    </ListItem>
  );
}
