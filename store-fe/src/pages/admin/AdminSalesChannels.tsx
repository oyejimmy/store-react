import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { 
  Phone, 
  LocationOn, 
  Info,
  LocalShipping as TruckIcon,
  Map as MapIcon,
  AttachMoney as DollarIcon,
  Email as EmailIcon,
  Store as StoreIcon,
  Warehouse as WarehouseIcon,
  Business as BuildingIcon,
  ViewInAr as CubesIcon,
  DeliveryDining as ShippingFastIcon,
  Mail as MailIcon,
  Inventory as BoxIcon
} from "@mui/icons-material";

// Create a type-safe icon component
const IconWrapper = ({
  icon: Icon,
  ...props
}: { 
  icon: React.ElementType,
  color?: string,
  key?: string 
} & React.HTMLAttributes<SVGElement>) => (
  <Icon {...props} style={{ color: props.color }} />
);

// Define the courier icons with type safety
const courierIcons: Record<string, React.ReactElement> = {
  TCS: <IconWrapper icon={TruckIcon} key="tcs" color="#E53935" />,
  "Leopard Courier": (
    <IconWrapper icon={MapIcon} key="leopard-courier" color="#0064d2" />
  ),
  BlueEx: <IconWrapper icon={DollarIcon} key="blue-ex" color="#0096C7" />,
  CallCourier: (
    <IconWrapper icon={EmailIcon} key="call-courier" color="#5D4037" />
  ),
  "M&P (Muller & Phipps)": (
    <IconWrapper icon={WarehouseIcon} key="m-p" color="#5C6BC0" />
  ),
  Rider: <IconWrapper icon={ShippingFastIcon} key="rider" color="#FFD100" />,
  Trax: <IconWrapper icon={BoxIcon} color="#2ECC71" />,
  Cheetay: <IconWrapper icon={StoreIcon} color="#FF5722" />,
  "Pakistan Post": <IconWrapper icon={MailIcon} color="#2196F3" />,
};

// Helper function to get a unique icon for each location
const getLocationIcon = (index: number): React.ReactElement => {
  const icons = [
    <IconWrapper key={`building-${index}`} icon={BuildingIcon} color="#E53935" />,
    <IconWrapper key={`store-${index}`} icon={StoreIcon} color="#0064d2" />,
    <IconWrapper key={`cubes-${index}`} icon={CubesIcon} color="#0096C7" />,
    <IconWrapper key={`map-${index}`} icon={MapIcon} color="#5D4037" />,
  ] as const;
  return icons[Math.abs(index) % icons.length];
};

interface Location {
  name: string;
  address: string;
  phone: string[];
}

interface Courier {
  name: string;
  services: string;
  notes: string;
  locations: Location[];
}

const courierData: Courier[] = [
  {
    name: "TCS",
    services: "Nationwide courier, international shipping, COD, warehousing",
    notes: "One of Pakistan’s most reliable couriers",
    locations: [
      {
        name: "Head Office",
        address: "I‑9/3 Markaz, Near Model Police Station",
        phone: ["051‑111123456", "051‑4440487"],
      },
      {
        name: "F‑8 Markaz Express Center",
        address: "Kohistan Rd",
        phone: ["0332‑5361098"],
      },
      {
        name: "Blue Area",
        address: "G‑7/3",
        phone: ["0333‑5112180"],
      },
      {
        name: "G‑11 Markaz",
        address: "Islamabad Arcade",
        phone: ["0300‑8542250"],
      },
      {
        name: "F‑6/1",
        address: "Khayaban‑e‑Suharwardy Rd",
        phone: ["051‑2274201"],
      },
      {
        name: "F‑11 Markaz",
        address: "Lords Trade Centre, Ground",
        phone: ["051‑2114100"],
      },
      {
        name: "F‑7 Markaz",
        address: "Javaid Pharmacy",
        phone: ["0316‑9992772"],
      },
      {
        name: "F‑11",
        address: "Sharjah Plaza",
        phone: ["0316‑9992779"],
      },
      {
        name: "Barakahu",
        address: "Barakahu",
        phone: ["051‑2321930"],
      },
    ],
  },
  {
    name: "Leopard Courier",
    services: "Domestic & international shipping, COD, fulfillment services",
    notes: "Popular among e‑commerce sellers",
    locations: [
      {
        name: "Head Office",
        address: "I‑9 Markaz, near Metro",
        phone: ["051‑111‑300‑786"],
      },
      {
        name: "Leopards House",
        address: "Raja Nizam‑ud‑Din Rd, Iqbal Town",
        phone: ["051‑111‑300‑786"],
      },
      {
        name: "Helplines",
        address: "Islamabad",
        phone: ["+92‑51‑2824743", "+92‑51‑2801267", "+92‑57‑2801268"],
      },
      {
        name: "Blue Area",
        address: "G‑6/2, Ghausia Plaza",
        phone: ["051‑2612321"],
      },
      {
        name: "DHA Phase II",
        address: "near Legnum Tower",
        phone: ["051‑4918068"],
      },
      {
        name: "Aabpara",
        address: "Shahbaz Plaza, G‑6/1",
        phone: ["0300‑9542629"],
      },
      {
        name: "F‑8 Markaz",
        address: "Shop #13, Pacific Center",
        phone: ["0305‑5519123"],
      },
    ],
  },
  {
    name: "BlueEx",
    services: "E‑commerce logistics, COD, fulfillment, platform integrations",
    notes: "Strong ecommerce focus",
    locations: [
      {
        name: "Zamaan Plaza",
        address: "Airport Service Road, Fazal Town",
        phone: ["021‑111‑258‑339"],
      },
      {
        name: "Islamabad Airport Office",
        address: "Islamabad Airport Office",
        phone: ["021‑111‑258‑339"],
      },
    ],
  },
  {
    name: "CallCourier",
    services: "COD, fulfillment, reverse logistics",
    notes: "Excellent for ecommerce merchants",
    locations: [
      {
        name: "Aabpara Booking Centre",
        address: "Shop #57-A, KK Bldg, Khayaban‑e‑Suharwardy Rd",
        phone: ["051‑2624738", "0304‑5130646"],
      },
    ],
  },
  {
    name: "M&P (Muller & Phipps)",
    services: "Courier, COD, warehousing",
    notes: "Widely trusted network",
    locations: [
      {
        name: "Main Office",
        address: "I‑9/2, near Jawa Chowk",
        phone: ["0316‑0020423"],
      },
      {
        name: "Blue Area Express Center",
        address: "Block E, G‑6/2",
        phone: ["0316‑0020336"],
      },
      {
        name: "Jalal Arcade",
        address: "Pakistan Town Phase 2, Block A, Police Foundation",
        phone: ["0331‑5168662"],
      },
    ],
  },
  {
    name: "Rider",
    services: "Last‑mile delivery, COD, real‑time tracking",
    notes: "Tech‑focused delivery",
    locations: [],
  },
  {
    name: "Trax",
    services: "E‑commerce logistics, same‑day fulfillment, Q‑commerce",
    notes: "Rapid, modern logistics",
    locations: [
      {
        name: "Main Office",
        address: "I‑10/3, 91 Street 7",
        phone: ["021‑111118729", "0324‑8090945"],
      },
      {
        name: "Bani Gala",
        address: "Khattak Plaza",
        phone: ["051‑6128844"],
      },
      {
        name: "G‑10 Markaz",
        address: "G‑10 Markaz",
        phone: ["0349‑5636446"],
      },
      {
        name: "Industrial Area",
        address: "Kahuta Rd",
        phone: ["051‑8733711"],
      },
    ],
  },
  {
    name: "Cheetay",
    services: "Urban delivery (food, parcels)",
    notes: "On‑demand, local deliveries",
    locations: [
      {
        name: "Rider hub",
        address: "Main IJP Road, Chungi (Islamabad/RWP)",
        phone: ["+92‑340‑333‑2970"],
      },
    ],
  },
  {
    name: "Pakistan Post",
    services: "National postal & COD services",
    notes: "Nationwide coverage, slower but affordable",
    locations: [
      {
        name: "Directorate General",
        address: "G‑8/4",
        phone: ["051‑111‑111‑117", "051‑8487080"],
      },
      {
        name: "PMG Islamabad",
        address: "",
        phone: ["051‑9261908", "051‑9260389"],
      },
      {
        name: "Controller IMO",
        address: "",
        phone: ["051‑9281273"],
      },
    ],
  },
];

const CourierServices: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);

  const handleClickOpen = (courier: Courier) => {
    setSelectedCourier(courier);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourier(null);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Header with Title */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          background: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Islamabad Couriers
        </Typography>
      </Box>

      {/* Courier Cards Grid */}
      <Grid container spacing={3}>
        {courierData.map((courier, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 2,
                p: 2,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              }}
              onClick={() => handleClickOpen(courier)}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    {courier.name}
                  </Typography>
                }
                avatar={courierIcons[courier.name]}
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  <span style={{ fontWeight: "bold" }}>Services:</span>{" "}
                  {courier.services}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  <span style={{ fontWeight: "bold" }}>Notes:</span>{" "}
                  {courier.notes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Courier Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            {selectedCourier && courierIcons[selectedCourier.name]}
            <Typography variant="h5" fontWeight="bold">
              {selectedCourier?.name}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedCourier && (
            <Box>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ mt: 2, mb: 1 }}
              >
                <Info color="primary" sx={{ mr: 1, verticalAlign: "middle" }} />
                Services & Notes
              </Typography>
              <Divider />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <span style={{ fontWeight: "bold" }}>Services:</span>{" "}
                {selectedCourier.services}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <span style={{ fontWeight: "bold" }}>Notes:</span>{" "}
                {selectedCourier.notes}
              </Typography>

              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ mt: 4, mb: 1 }}
              >
                <LocationOn
                  color="primary"
                  sx={{ mr: 1, verticalAlign: "middle" }}
                />
                Islamabad Office Locations & Contact Details
              </Typography>
              <Divider />
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {selectedCourier.locations.length > 0 ? (
                  selectedCourier.locations.map((loc, locIndex) => (
                    <Grid item xs={12} sm={6} md={4} key={locIndex}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardHeader
                          avatar={getLocationIcon(locIndex)}
                          title={
                            <Typography variant="body1" fontWeight="bold">
                              {loc.name}
                            </Typography>
                          }
                          sx={{ p: 0, pb: 1 }}
                        />
                        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                          {loc.address && (
                            <Typography variant="body2" color="text.secondary">
                              {loc.address}
                            </Typography>
                          )}
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            spacing={1}
                            sx={{ mt: 1 }}
                          >
                            {loc.phone.map((number, numIndex) => (
                              <Chip
                                key={numIndex}
                                icon={<Phone sx={{ fontSize: 16 }} />}
                                label={number}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Contact details are not available in publicly accessible
                      sources.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourierServices;
