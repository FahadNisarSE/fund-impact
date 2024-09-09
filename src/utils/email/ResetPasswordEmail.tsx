import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ResetPasswordProps {
  useremail?: string;
  resetLink?: string;
  logo?: string;
}

export const ResetPassword = ({
  useremail,
  logo,
  resetLink,
}: ResetPasswordProps) => {
  const previewText = `Verify you email address.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={logo}
                width="40"
                height="37"
                alt="FundImpact"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Password Reset Request</strong>
            </Heading>

            <Text className="text-black text-[14px] leading-[24px]">
              We received a request to reset the password for your FundImpact
              account. If you made this request, please click the button below
              to reset your password.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={resetLink}
              >
                Reset Your Password
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              Or copy and paste this URL into your browser:{" "}
              <Link href={resetLink} className="text-blue-600 no-underline">
                {resetLink}
              </Link>
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This password reset link is exclusively for{" "}
              <span className="text-black">{useremail}</span>. If you did not
              request a password reset, please ignore this email. For any
              security concerns, feel free to reply to this email or contact our
              support team.
            </Text>

            <Text className="text-[#666666] text-[12px] leading-[24px] mt-5">
              <em>
                &quot;The best way to predict the future is to create it.&quot;
              </em>{" "}
              – Abraham Lincoln
            </Text>

            <Text className="text-[#666666] text-[12px] leading-[24px] mt-1">
              <em>
                &quot;Small acts, when multiplied by millions of people, can
                transform the world.&quot;
              </em>{" "}
              - Howard Zinn
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ResetPassword;
