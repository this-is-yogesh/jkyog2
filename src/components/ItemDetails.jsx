import { Box, Button, IconButton, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { shades } from "../theme";
import { addToCart } from "../state";
import { useDispatch } from "react-redux";
import { encode as btoa } from "base-64";
import Item from "./Item";
import Loader from "./Loader";
// import { Link } from "react-router-dom";

const ItemDetails = () => {
  const dispatch = useDispatch();
  //const { itemId } = useParams();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState([]);
  const [itemid, setItemid]= useState();
  //   const [items, setItems] = useState([]);
  const [i, setId] = useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getData = async () => {
    try {
      await fetch(`http://localhost:3000/item/${params.itemId}`);
      setId(params.itemId);
    } catch (err) {
      console.log(err, "this is error");
    }
  };

  console.log(item, "itemed");
  const updateditem = item.filter((d) => {
    return d.id == i;
  });

  console.log(updateditem, "updateditem");

  useEffect(() => {
    async function getItems() {
      try {
        var headers = new Headers();
        headers.append(
          "Authorization",
          "Basic " +
            btoa(
              "0606ded7fe76f5359b6c3aa895095394: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"
            )
        );
        const result = await fetch("http://localhost:5000/products.json", {
          headers: headers,
        });
        const itemJson = await result.json();
        setItem(itemJson.products);
        setLoading(false);
      } catch (err) {
        console.log(err, "this is error");
      }
    }
    getData();
    getItems();

  }, [params.itemId]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {updateditem.map((updateditem, index) => (
            <Box width="80%" m="80px auto" key={updateditem.id}>
              <Box display="flex" flexWrap="wrap" columnGap="40px">
                {/* IMAGES */}

                <Box flex="1 1 40%" mb="40px">
                  <img
                    alt={updateditem?.title}
                    width="100%"
                    height="100%"
                    src={updateditem.image?.src}
                    style={{ objectFit: "contain" }}
                  />
                </Box>

                {/* ACTIONS */}
                <Box flex="1 1 50%" mb="40px">
                  <Box display="flex" justifyContent="space-between">
                    <Box>Home/Item</Box>
                    <Box>Prev Next</Box>
                  </Box>

                  <Box m="65px 0 25px 0">
                    <Typography variant="h3">{updateditem?.title}</Typography>

                    <Typography
                      sx={{ mt: "20px" }}
                      dangerouslySetInnerHTML={{
                        __html: updateditem.body_html,
                      }}
                    >
                      {/* {item?.attributes?.longDescription} */}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" minHeight="50px">
                    <Box
                      display="flex"
                      alignItems="center"
                      border={`1.5px solid ${shades.neutral[300]}`}
                      mr="20px"
                      p="2px 5px"
                    >
                      <IconButton
                        onClick={() => setCount(Math.max(count - 1, 0))}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ p: "0 5px" }}>{count}</Typography>
                      <IconButton onClick={() => setCount(count + 1)}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Button
                      sx={{
                        backgroundColor: "#222222",
                        color: "white",
                        borderRadius: 0,
                        minWidth: "150px",
                        padding: "10px 40px",
                      }}
                      onClick={() =>
                        dispatch(addToCart({ item: { ...updateditem, count } }))
                      }
                    >
                      ADD TO CART
                    </Button>
                  </Box>
                  <Box>
                    <Box m="20px 0 5px 0" display="flex">
                      <FavoriteBorderOutlinedIcon />
                      <Typography sx={{ ml: "5px" }}>
                        ADD TO WISHLIST
                      </Typography>
                    </Box>
                    <Typography>CATEGORIES: {updateditem.tags}</Typography>
                    <Typography alignItems="flex-end">
                      PRICE - ${updateditem?.variants[0].price}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* INFORMATION */}
              <Box m="20px 0">
                <Tabs value={value} onChange={handleChange}>
                  <Tab label="DESCRIPTION" value="description" />
                  <Tab label="REVIEWS" value="reviews" />
                </Tabs>
              </Box>
              <Box display="flex" flexWrap="wrap" gap="15px">
                {/* {value === "description" && (
        //   <div>{item?.attributes?.longDescription}</div>
        )} */}
                {value === "reviews" && <div>reviews</div>}
              </Box>

              {/* RELATED ITEMS */}
              <Box mt="50px" width="100%">
                <Typography variant="h3" fontWeight="bold">
                  Related Products
                </Typography>
                <Box
                  mt="20px"
                  display="flex"
                  flexWrap="wrap"
                  columnGap="1.33%"
                  justifyContent="space-between"
                >
                  {item.slice(31, 35).map((item, i) => (
                    <Item item={item} key={`${item.title}-${item.id}`} />
                  ))}
                </Box>
              </Box>
            </Box>
          ))}
        </>
      )}
    </>
  );
};

export default ItemDetails;
