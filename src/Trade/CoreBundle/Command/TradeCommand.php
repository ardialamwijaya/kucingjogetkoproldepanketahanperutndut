<?php

namespace Trade\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
include "src/Trade/CoreBundle/build/ccxt.php";

class TradeCommand extends ContainerAwareCommand
{
    private $arrExchanges;

    private $arrArbitrageCurrencies;

    private $arrScalpingCurrencies;

    private $settings;

    protected function configure()
    {
        $this
            ->setName('initiate:bot:trade')
            ->setDescription('Trading with scalping method')
            ->addOption("mode","m", InputOption::VALUE_OPTIONAL, 'bot mode');
    }

    protected function predefineVariables()
    {
        $this->arrExchanges = $this->getContainer()->getParameter("exchange");
        $this->arrArbitrageCurrencies = $this->getContainer()->getParameter("arbitrage_currencies");
        $this->arrScalpingProperties = $this->getContainer()->getParameter("scalping_properties");
        $this->settings = $this->getContainer()->getParameter("settings");
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     *
     * @return void
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        //do the predefine vars
        $this->predefineVariables();

        //1.do arbitrage
        $mainArbitrage = $this->getContainer()->get("arbitrage.main");
        foreach($this->arrExchanges as $exchange){
            $arrObjExchange[$exchange] = $this->getContainer()->get("ccxt.".$exchange);
        }

        $arbitrationStatus = $mainArbitrage->doArbitrationProcess($arrObjExchange, $this->arrArbitrageCurrencies, $this->settings);
        if($arbitrationStatus=="success") exit();
    }
}