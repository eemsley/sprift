import * as React from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

const SpriftVenderIntro1 = () => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Sprift - Thrifting Made Easy and Efficient!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              width={114}
              src="https://firebasestorage.googleapis.com/v0/b/spree-a842f.appspot.com/o/images%2Flogo.png?alt=media&token=a066418d-481b-4cc1-8dc5-2973a42cbf2a"
              alt="Sprift"
              style={logo}
            />
          </Section>
          <Section style={sectionsBorders}></Section>
          <Section style={content}>
            <Text style={paragraph}>Hello Vendor,</Text>
            <Text style={paragraph}>
              Welcome to Sprift, the future of thrifting and a gateway to reach
              your customers in a more efficient and exciting manner. Our
              platform provides a seamless experience to import all your
              pre-existing listings from other platforms.
            </Text>
            <Text style={paragraph}>
              We're excited to share that our beta is soon to launch! This is a
              game-changer. A unique opportunity to reach a community of
              passionate thrifters and increase your sales.{" "}
              <Link href="https://spree-commerce.com" style={link}>
                Get ready to make the switch today!
              </Link>
            </Text>
            <Text style={paragraph}>
              For any queries or assistance, please feel free to connect with
              our{" "}
              <Link href="https://spree-commerce.com/contact" style={link}>
                Sprift Support
              </Link>
            </Text>
            <Text style={paragraph}>
              Let's revolutionize thrifting,
              <br />
              The Sprift Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Column align="right" style={{ width: "50%", paddingRight: "8px" }}>
              <Img
                src="https://firebasestorage.googleapis.com/v0/b/spree-a842f.appspot.com/o/images%2Flinkedin-logo.png?alt=media&token=084715db-2c87-4e55-96ec-f894e5b23bc8"
                width="30px"
              />
            </Column>
            <Column align="left" style={{ width: "50%", paddingLeft: "8px" }}>
              <Img
                src="https://firebasestorage.googleapis.com/v0/b/spree-a842f.appspot.com/o/images%2Flinkedin-logo.png?alt=media&token=084715db-2c87-4e55-96ec-f894e5b23bc8"
                width="30px"
              />
            </Column>
          </Row>
          <Text style={{ textAlign: "center", color: "#706a7b" }}>
            © 2023 Sprift, All Rights Reserved <br />
            350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
          </Text>
        </Section>
      </Body>
    </Html>
  );
};

export default SpriftVenderIntro1;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  color: "black",
  fontSize: "16px",
  lineHeight: "26px",
};

const container = {
  paddingTop: "20px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logoContainer = {
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 0px 20px 0px",
};

const footer = {
  width: "800px",
  margin: "0 auto",
};

const content = {
  padding: "5px 10px 10px 0px",
};

const logo = {
  margin: "0 auto",
};

const sectionsBorders = {
  width: "100%",
  display: "flex",
};

const link = {
  textDecoration: "underline",
};
