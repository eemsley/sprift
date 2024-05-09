import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export const SpriftVenderIntroExtended = () => (
  <Html>
    <Head />
    <Preview>
      Join Sprift - Revolutionizing the vintage and thrifting market
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://firebasestorage.googleapis.com/v0/b/spree-a842f.appspot.com/o/images%2Flogo.png?alt=media&token=a066418d-481b-4cc1-8dc5-2973a42cbf2a"
          width="150"
          alt="Sprift"
          style={logo}
        />
        <Text style={paragraph}>Hello Vendor,</Text>
        <Text style={paragraph}>
          We're excited to introduce you to Sprift, a groundbreaking platform
          set to revolutionize the thrifting market. We understand the
          challenges and complexities you face in reaching the right customers
          and maximizing your sales. That's why we've created Sprift, with the
          sole purpose of making thrifting more accessible and enjoyable for
          vendors like you.
        </Text>
        <Text style={paragraph}>
          At Sprift, we're leveraging innovative technology to offer an
          enjoyable and personalized thrifting experience for both buyers and
          sellers. Importing your pre-existing listings from other platforms is
          easy, meaning you can start selling instantly and reach a broader
          audience of passionate thrifters.
        </Text>
        <Text style={paragraph}>
          But we're not stopping there. We're thrilled to let you know that our
          beta version is about to launch soon! It comes packed with features
          designed to simplify your operations, enhance your sales, and connect
          you with the right customers. We're sure you'll love the changes we've
          made.
        </Text>

        <Text style={paragraph}>
          We can't wait to see your unique pre-loved fashion treasures on
          Sprift. If you have any questions or need any help getting started,
          don't hesitate to get in touch. Welcome aboard!
        </Text>

        <Section style={btnContainer}>
          <Button pX={12} pY={12} style={button} href="https://getsprift.com">
            Get started
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Sprift team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
        </Text>
      </Container>
    </Body>
  </Html>
);

export default SpriftVenderIntroExtended;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#4e7e7a",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
