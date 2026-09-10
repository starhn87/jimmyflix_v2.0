import React from 'react'
import {
  Box,
  CenteredItem,
  Flag,
  Logo,
  Name,
  Product,
} from '../../components/detail'
import Message from '../common/Message'
import Section from '../common/Section'
import { ICompany, ICountry } from '../../interface'

interface ProductionProps {
  production_companies: []
  production_countries: []
}

export default function Production({
  production_companies,
  production_countries,
}: ProductionProps) {
  return (
    <>
      {
        <Box>
          {production_companies?.length > 0 && (
            <Section slide={false} title="Production Companies">
              {production_companies.map((company: ICompany) => (
                <CenteredItem key={company.id}>
                  <Product>
                    <Logo
                      logo={company.logo_path}
                      src={
                        company.logo_path
                          ? `https://image.tmdb.org/t/p/original${company.logo_path}`
                          : '/images/defaultProduction.png'
                      }
                      alt={`${company.name}`}
                    />
                  </Product>
                  <Name>
                    {company.name.length > 17
                      ? `${company.name.substring(0, 17)}...`
                      : company.name}
                  </Name>
                </CenteredItem>
              ))}
            </Section>
          )}
          {production_countries?.length > 0 && (
            <Section slide={false} title="Production Countries">
              {production_countries.map((country: ICountry) => (
                <CenteredItem key={country.iso_3166_1}>
                  <Flag
                    src={`https://flagcdn.com/w160/${country.iso_3166_1.toLowerCase()}.png`}
                    alt={`${country.name} flag`}
                  />
                  <Name>
                    {country.name.length > 17
                      ? `${country.name.substring(0, 17)}...`
                      : country.name}
                  </Name>
                </CenteredItem>
              ))}
            </Section>
          )}
        </Box>
      }
      {(!production_companies || production_companies.length === 0) &&
        (!production_countries || production_countries.length === 0) && (
          <Message color="#eee" text={'No Production Found'} />
        )}
    </>
  )
}
