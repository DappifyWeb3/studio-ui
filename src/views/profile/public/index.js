// material-ui
import { useEffect, useState, useContext } from "react";
import {
	Container,
	Avatar,
	Typography,
	Paper,
	Grid,
	Box,
	Button
} from "@mui/material";
import { useParams } from "react-router-dom";
import Identicon from "react-identicons";
import axios from "axios";
import * as icons from "tabler-icons-react";
import { DappifyContext } from "react-dappify";

// =============================|| LANDING MAIN ||============================= //

const PublicProfile = () => {
	const { id } = useParams();
	const [nfts, setNfts] = useState([]);
	const { Provider } = useContext(DappifyContext);
	const [profile, setProfile] = useState({});
	console.log(id);

	useEffect(() => {
		const urlAddress = id.startsWith("0x") ? id : null;
		const targetAddress = profile?.ethAddress
			? profile?.ethAddress
			: urlAddress
			? urlAddress
			: null;
		if (targetAddress) {
			loadNfts(targetAddress);
		}
	}, [profile]);

	const loadProfile = async () => {
		console.log(Provider);

		const userProfile = await Provider.Cloud.run("getProfileByHandle", {
			handle: id
		});
		setProfile(userProfile);
		console.log(userProfile);
	};

	const loadNfts = async (targetAddress) => {
		console.log("loading nfts for " + targetAddress);
		let items = [];
		console.log(profile);
		const chainId = profile?.profile?.chainId || "0x1";
		try {
			items = await axios.get(
				`https://deep-index.moralis.io/api/v2/${targetAddress}/nft?chain=${chainId}&format=decimal`,
				{
					headers: {
						"X-API-Key": process.env.REACT_APP_MORALIS_API_KEY,
						accept: "application/json"
					}
				}
			);
			setNfts(items.data.result);
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (id) {
			loadProfile();
			// loadNfts();
		}
	}, [id]);

	const listNfts = () => {
		const items = [];
		nfts.forEach((nft, index) => {
			console.log(nft);
			const m = JSON.parse(nft.metadata);
			if (m) {
				console.log(m);
				items.push(
					<Grid item xs={6} sm={4} md={3} justifyContent="center">
						<Paper
							elevation={10}
							variant="outlined"
							sx={{
								position: "relative",
								height: 200,
								overflow: "hidden",
								borderRadius: 3,
								width: 175,
								margin: "0 auto"
							}}
						>
							<Box
								sx={{
									height: 150,
									width: "100%",
									overflow: "hidden",
									background: `url(${
										m.image || m.image_url
									})`,
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center"
								}}
								className="nft-image"
							></Box>
							<Box
								sx={{
									p: 1,
									background: "white",
									position: "absolute",
									top: 150,
									width: "100%"
								}}
							>
								<Typography fontWeight="bold">
									{m.name}
								</Typography>
								<Typography fontWeight="light">
									{nft.name}
								</Typography>
							</Box>
						</Paper>
					</Grid>
				);
			} else {
				console.log("no metadata");
			}
		});
		return items;
	};

	const listLinks = () => {
		const items = [];
		console.log(profile);
		profile?.profile?.links?.forEach((prop) => {
			items.push(
				<Grid item xs={12}>
					<Button
						fullWidth
						variant="contained"
						size="small"
						href={prop.url}
						target="_blank"
						sx={{
							background: profile?.profile?.buttonColor,
							":hover": {
								background: profile?.profile?.buttonColorHover
							},
							p: 2
						}}
					>
						<Grid container>
							<Box
								sx={{ position: "absolute", left: 20, top: 8 }}
							>
								<Avatar
									sx={{
										bgcolor: "white",
										width: 44,
										height: 44,
										margin: "0 auto"
									}}
									src={prop.image}
								/>
							</Box>
							<Grid item xs={12} textAlign="center">
								<Typography
									variant="h2"
									sx={{ color: profile?.profile?.textColor }}
								>
									{prop.title}
								</Typography>
							</Grid>
						</Grid>
					</Button>
				</Grid>
			);
		});

		return items;
	};

	const profileImage = profile?.profile?.image ? (
		<img src={profile?.profile?.image} alt="" width="96" height="auto" />
	) : (
		<Identicon string={id} size={96} />
	);

	const defaultBackgrounds = [
		"https://blogger.googleusercontent.com/img/a/AVvXsEgsOHLdu5plKv6SpXJBoyV0KHXH05w5ajZq7ikk8BQjfiD9YvMatn1aqxVJL4cxTjGU1SotFexwONSubqHHEDtOygLdwCOZII814JUFddrWV2v0V4lLuRWFdS7WXtWs4q5fnxbINnTMmcqlJAuZpg0_tSsPNjjbwj1mQu_CeFA-SIM1iglPuBccMxfzOQ=s16000"
	];

	const getBg = () => {
		console.log(profile);
		if (profile) {
			if (profile?.profile?.background) {
				return `url(${profile?.profile?.background})`;
			} else if (profile?.profile?.backgroundColor) {
				return profile?.profile?.backgroundColor;
			} else {
				return `url(${defaultBackgrounds[0]})`;
			}
		} else {
			return `url(${defaultBackgrounds[0]})`;
		}
	};

	return (
		<Container
			sx={{
				background: getBg(),
				backgroundSize: "cover",
				position: "absolute",
				width: "100%",
				height: "100vh",
				maxWidth: "100% !important",
				pb: 200
			}}
		>
			<Grid
				container
				spacing={1}
				justifyContent="center"
				alignItems={"center"}
				sx={{
					mb: 5,
					maxWidth: 800,
					margin: "0 auto",
					textAlign: "center"
				}}
			>
				<Grid item xs={12} sx={{ mt: "10%" }}>
					<Avatar
						sx={{
							bgcolor: "white",
							width: 96,
							height: 96,
							margin: "0 auto"
						}}
					>
						{profileImage}
					</Avatar>
				</Grid>
				<Grid item xs={12}>
					<Typography
						variant="h2"
						sx={{ color: profile?.profile?.textColor }}
					>
						{profile?.username || id}
					</Typography>
					<Typography
						variant="h4"
						fontWeight="light"
						sx={{ color: profile?.profile?.textColor }}
					>
						{profile?.ethAddress}
					</Typography>
				</Grid>
			</Grid>

			<Grid
				container
				spacing={1}
				justifyContent="center"
				alignItems={"center"}
				sx={{ maxWidth: 800, margin: "0 auto", mt: 3 }}
			>
				{listLinks()}
				<Grid item xs={12}>
					<Typography
						variant="h3"
						sx={{ color: profile?.profile?.textColor, mt: 5 }}
					>
						My NFT
					</Typography>
				</Grid>
				{listNfts()}
			</Grid>
		</Container>
	);
};

export default PublicProfile;
