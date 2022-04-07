import React from 'react'
import { Box, Flag, Logo, Name, Product } from '../../pages/Detail'
import defaultProductionImg from '../../assets/images/noProductionSmall.png'
import Message from '../common/Message'
import Section from '../common/Section'

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
      {!(
        (!production_companies || production_companies.length === 0) &&
        (!production_countries || production_countries.length === 0)
      ) && (
        <Box>
          {production_companies && production_companies.length > 0 && (
            <Section slide={false} title="Production Companies">
              {production_companies.map(
                (
                  company: {
                    id: number
                    logo_path: string
                    name: string
                  },
                  index: number,
                ) => (
                  <div key={company.id}>
                    <Product>
                      <Logo
                        logo={company.logo_path}
                        src={
                          company.logo_path
                            ? `https://image.tmdb.org/t/p/original${company.logo_path}`
                            : defaultProductionImg
                        }
                        alt={`${company.name}`}
                      />
                    </Product>
                    <Name>
                      {company.name.length > 17
                        ? `${company.name.substring(0, 17)}...`
                        : company.name}
                    </Name>
                  </div>
                ),
              )}
            </Section>
          )}
          {production_countries && production_countries.length > 0 && (
            <Section slide={false} title="Production Countries">
              {production_countries.map(
                (
                  country: { name: string; iso_3166_1: string },
                  index: number,
                ) => (
                  <div key={index}>
                    <Flag
                      src={`https://flagcdn.com/w160/${country.iso_3166_1.toLowerCase()}.png`}
                    />
                    <Name>
                      {country.name.length > 17
                        ? `${country.name.substring(0, 17)}...`
                        : country.name}
                    </Name>
                  </div>
                ),
              )}
            </Section>
          )}
        </Box>
      )}
      {(!production_companies || production_companies.length === 0) &&
        (!production_countries || production_countries.length === 0) && (
          <Message color="#eee" text={'No Production Found'} />
        )}
    </>
  )
}
