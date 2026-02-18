import useShopDetails from "../../hooks/useShopDetails";

const Footer = () => {
  const { shopDetails } = useShopDetails();

  if (!shopDetails) return null;

  return (
    <footer className="footer">
      <p>{shopDetails.businessName}</p>
      <p>{shopDetails.address}</p>
      <p>{shopDetails.contactPhone}</p>
    </footer>
  );
};

export default Footer;
