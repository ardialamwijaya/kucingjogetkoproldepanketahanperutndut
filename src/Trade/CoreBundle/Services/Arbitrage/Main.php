<?php

namespace Trade\CoreBundle\Services\Arbitrage;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Validator\Constraints\DateTime;

class Main
{

    private $entityManager;

    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function doArbitrationProcess($arrObjExchange, $arrArbitrageCurrencies, $settings){
        foreach($arrArbitrageCurrencies as $arbitrageCurrency) {
            foreach($arrObjExchange as $indexExchange => $objExchange) {
                $arrTickerData[$indexExchange] = $objExchange->fetch_ticker($arbitrageCurrency);
            }
            $profitTransactionProperties = $this->calculateProfitableTransaction($arrTickerData);
            if(!empty($profitTransactionProperties)){
                $this->doCryptoTransaction($profitTransactionProperties);
                $this->saveTransactionData($profitTransactionProperties);
                $this->emailTransactionData($profitTransactionProperties);
            }
        }
    }

    public function calculateProfitableTransaction($arrTickerData){
        $returnValue = array();
        $lowestBuyProperties = $this->getLowestAsk($arrTickerData);
        $highestSellProperties = $this->getHighestBid($arrTickerData);
        if($lowestBuyProperties["amount"] < $highestSellProperties["amount"]){
            $returnValue["lowest_buy_properties"] = $lowestBuyProperties;
            $returnValue["highest_sell_properties"] = $highestSellProperties;
        }
        return $returnValue;
    }

    public function getLowestAsk($arrTickerData){
        $returnValue = array();
        $lowestBuy = 99999999;
        $dateTime = new \DateTime;
        foreach($arrTickerData as $indexExchange=> $objExchange){
            if($lowestBuy > $objExchange["ask"]){
                $lowestBuy = $objExchange["ask"];
                $returnValue["exchange"] = $indexExchange;
                $returnValue["amount"] = $lowestBuy;
                $returnValue["datetime"] = $dateTime->setTimestamp($objExchange["timestamp"]);
            }
        }

        return $returnValue;
    }

    public function getHighestBid($arrTickerData){
        $returnValue = array();
        $highestBid = 0;
        $dateTime = new \DateTime;
        foreach($arrTickerData as $indexExchange=> $objExchange){
            if($highestBid < $objExchange["bid"]){
                $highestBid = $objExchange["bid"];
                $returnValue["exchange"] = $indexExchange;
                $returnValue["amount"] = $highestBid;
                $returnValue["datetime"] = $dateTime->setTimestamp($objExchange["timestamp"]);
            }
        }
        return $returnValue;
    }

    public function doCryptoTransaction($profitTransaction){
        //do buy and sell
    }

    public function saveTransactionData(){
        $this->entityManager->persist($entity);
        $this->entityManager->flush();
    }

    public function saveAbritrageData($tickerData)
    {
        $tickerEntity = $this->buildTickerEntity($tickerData);
        $this->entityManager->persist($tickerEntity);
        $this->entityManager->flush();
    }
}