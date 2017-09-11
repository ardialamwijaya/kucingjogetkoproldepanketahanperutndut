<?php
/**
 * Created by PhpStorm.
 * User: Ardi
 * Date: 10/09/2017
 * Time: 07.10
 */

namespace Trade\CoreBundle\Services\Arbitrage;


class Builder
{
    public static function buildCompanySourceByCompany($transactionData)
    {



        $companySource = new CompanySource();
        $companySource->setCompany($company);
        $companySource->setCreatedDate(new \DateTime());
        $companySource->setIsActive(1);
        $companySource->setSource($source);

        return $companySource;
    }
}