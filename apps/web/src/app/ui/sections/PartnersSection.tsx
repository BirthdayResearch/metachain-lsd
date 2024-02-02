import SectionContainer from "@/app/ui/components/SectionContainer";
import { Tag } from "@/app/ui/components/Tag";
import Image from "next/image";
import jellyverse from "@/app/ui/icons/partners/jellyverse.svg";
import javsphere from "@/app/ui/icons/partners/javsphere.svg";
import cryptofactor from "@/app/ui/icons/partners/cryptofactor.svg";
import vanillaswap from "@/app/ui/icons/partners/vanillaswap.svg";
import defichain from "@/app/ui/icons/partners/defichain.svg";
import opendapps from "@/app/ui/icons/partners/opendapps.svg";

import React from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface Partner {
  name: string;
  logo: StaticImport;
  style: string;
}

const partners: Partner[] = [
  { name: "jellyverse", logo: jellyverse, style: "py-5" },
  { name: "javsphere", logo: javsphere, style: "py-5" },
  { name: "cryptofactor", logo: cryptofactor, style: "py-5" },
  { name: "vanillaswap", logo: vanillaswap, style: "py-5" },
  { name: "defichain", logo: defichain, style: "py-5" },
  { name: "opendapps", logo: opendapps, style: "py-[14px] px-10" },
];

export default function PartnersSection() {
  return (
    <SectionContainer customContainerStyle="gap-y-16">
      <div className="grid md:gap-y-4">
        <div className="grid gap-y-3 md:gap-y-6">
          <Tag text="ECOSYSTEM" testID="ecosystem" />
          <h2 className="h2-text text-light-1000">
            Your mDFI can be staked with these partners
          </h2>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-5 overflow-x-auto">
          {partners.map((partner, index) => (
            <div key={index} className="shrink-0 md:shrink">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={200}
                height={200}
                className={partner.style}
              />
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
