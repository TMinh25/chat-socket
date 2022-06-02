import { Center, Heading, Image, Stack } from "@chakra-ui/react";
import * as React from "react";
import HeroImage from "../assets/hero-image.png";

export const HomePage = () => {
  return (
    <Center h="100%">
      <Stack>
        <Image src={HeroImage} alt="hero-image" h={"60%"} />
        <Heading size="lg">Trò chuyện với mọi người trên thế giới</Heading>
      </Stack>
    </Center>
  );
};